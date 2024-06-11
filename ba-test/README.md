# `ba-test`
This project directory contains BAT UX test scenarios.

## How To Execute Tests On Local Environment

- To execute your feature, you need to provide the following parameters:
    - `THREADS=${ThreadsToExecuteAtRunTime} FEATURE=${YOUR FEATURE} TAGS=@${CucumberAnnotation}` Followed
      by: `npm run bdd:cucumber`
- To execute your feature you would run a command similar to the following:
    - `THREADS=1 FEATURE='teacher-login' TAGS='@Teacher' npm run bdd`
- To execute specific tag(s) you would run commands similar to the following:
    - `THREADS=1 TAGS='@Teacher' npm run bdd`
    - `THREADS=1 TAGS='@Manual and @Teacher' npm run bdd`

## How To Execute Tests On Jenkins Pipeline

1. Select a Thread from the dropdown
2. Select a Test Environment from the dropdown
3. Choose true from the Browser Configuration dropdown if you want to manually select an operating system, browser, and
   browser version. Choose false to skip Browser Configuration.
4. Type the tags you would like to run. Examples:
    - To run Manual Teacher scenarios you would type `@Teacher and @Manual`
    - To run a Login feature with a manual student user you would type `@Manual and @Student and @Login`
5. Type the branch name you would like to execute on. For example: `CPD-test123`

## How to run on LambdaTest locally

1. Add to your run command: `RUN_ON_LAMBDA=true`

# How to use Scholastic API Client?

## 1. About API methods structure

Scholastic uses REST architecture to make safe and secure API calls. To grant the privacy of the requests, the company uses JWT technology in the header of its requests.

Also, the CPD application has some dynamic data like: staffID, environment, and class number.

## 2. About Client Architecture

Pre-configuration for projects outside CPD…

* Developer must define a static token for each environment and hardcode it in the function `getBaseUrlByEnv(environment:string)`;

** Example: **
```typescript
export function getBaseUrlByEnv(environment: string): string {
        let env = environment.toLowerCase();
        if (env === 'stage') env = 'dev';
        return `https://cpd-service.${env.toLowerCase()}.apps.scholastic.tech`;
        }
```

* Developer must define `staffId` for each environment, for each used user role (teacher1, student1, etc.) in the method `getStaffId`;
* Developer must define the used base url if its different from `https://cpd-service.${env}.apps.scholastic.tech` in the method `getBaseUrlByEnv`.

Once the configuration was done:

- Endpoints are defined in ScholasticEndpoints abstract class;
- `ScholasticRequestBuilder` implements the Builder Design Pattern to build the requests already setting up token, endpoint, and header in the format used in `axios` library and the `request` lambda function returns the data result of the request. We could use this Builder to build any kind of request. For now, we implemented the `get` method because in our project we are just using `HTTP GET`.
- `getDataFromScholasticApi<T>(endpoint:string): Promise<T>` is the method that will make all the API calls in our automation and will return a Data Transfer Object (DTO) which is an object which will wrap the JSON in Object Oriented pattern. All DTOs are (and should be in the future) in the folder `cpd-test/src/test-utilities/dtos`.
    - Here, we have an important note. Sometimes it’s hard to understand the hierarchy of a JSON file, specifically when it is too big. We strongly recommend you to use `https://jsoncrack.com/editor` to have a graphic view of any JSON.
    - Another important note: To help you to create the DTO, I strongly recommend you to use `https://transform.tools/json-to-typescript` tool. And, of course, reorganize the results appropriatelly.

```typescript
export abstract class ScholasticEndpoints {
    //...
    public static getStudents(className: string) {
        const classReference = getCpdClassReference(className);
        return `${ScholasticEndpoints.BASE_URL}/classes/${classReference}/students`;
    }
    
    public static getSomeOtherEndpoint(param1: string, param2: string){
        // Implement some code here
        return `${the_string_of_the_endpoint_applied_the_parameters}`;
    
}
```
Where to define the API calls?

- API calls are used in different contexts. This means that we could make the same call in different Pages and in different contexts inside one page. Although Page Object anti-pattern violates SOLID principles, once we are using it for business reason, we need, at least, reduce the impact of this violation. While a page is doing an API call, there is no architectural sense to have a method “getEntitledStudentsFromApi” in any page, because Page Object wraps the UI view and behaviour; they are in the View Layer in MVC pattern. The thing is worse when we can make the same API call from different Page Objects. The first solution should be to use hierarchy, but when we `extend` a Child Page from a Parent Page, it says Child Page “IS A” Parent Page and, in the most times, it is not. So, we are creating bad architecture just to try to reuse the methods, and it violates the encapsulation principle, just to start.
- Regarding this, we created a module called `api-interface` that will have all api calls and will be used for different pages in significative methods, like `validateIfEntitledUsersArePresentInTable`. So, if you want to implement an API call or use one already created, this is the place. All of them, until now, is using `getDataFromScholasticApi` and they are examples on how to use properly DTOs.

## How to create an API Call in CPD?

### What is DTO?
DTO (Data Transfer Object) is a POJO class created only for data transfer, and which have the exact `json` parameters names.

** Example: **

```typescript
export interface EntitlementDto {
  nsgra?:  string[];
  sl?:     string[];
  lba?:    any[];
  word?:   string[];
  first?:  string[];
  litpro?: string[];
}
```

1. If the endpoint is defined in ScholasticEndpoints class and DTO is already created:
    1. Just call `getDataFromScholasticApi` passing the DTO class name in template and the endpoint in the parameters.
** Example: ** 
```typescript
// eslint-disable-next-line class-methods-use-this
export async function getStudentsFromApi(className: string): Promise<StudentListDto> {
  // eslint-disable-next-line no-return-await
  return await getDataFromScholasticApi<StudentListDto>(ScholasticEndpoints.getStudents(className));
}
```
2. If the endpoint is defined in ScholasticEndpoints class, but DTO was not created:
    1. Create the DTO (or DTOs) in the proper folder;
    2. Call `getDataFromScholasticApi` passing the DTO class name in template and the endpoint in the parameters.
3. If neither endpoint or DTO is defined:
    1. Create a method with a proper name in ScholasticEndpoints, paying attention on parametrisation present in endpoint.
    2. Repeat steps defined on item 2 of this list.
4. If you want to use for PUSH, PUT, DELETE, etc. then add the HTTP method name in the enum HttpMethods, create a `pushDataInScholasticApi` in `api-client` file.

## A Practical Full example

Imagine you want to add a `GET` call in your `MyPage.ts`.
So, you will have a code like this:

### ...test-utilities/dtos/MyResultDto.ts
```typescript

export class OtherObjectDto {
    name: string
    //something here
}

export class MyResultDto {
    jsonParam1: string
    jsonParam2: OtherObjectDto[]
    //something here
}
```

### api-interface.ts
```typescript
export async function getSomethingFromScholasticApi(param1: string){
    const result: MyResultDto = getDataFromScholasticApi<MyResultDto>(param1) as MyResultDto;
    // we can do something here
    // generally we return the DTO
    return result;
}
```
### ...pages/MyPage.ts ###

```typescript
import BasePage from "./BasePage";

class MyPage extends BasePage{
    // some code here
    public async methodWhichUseApiCall(param1: string){
        //considering the method will return the DTO
        const dataINeed = await getSomethingFromScholasticApi(param1) as MyResultDto;
        const dataIWannaUse: string = result.jsonParam1;
        const jsonParam2: OtherObjectDto[]  = result.jsonParam2 as OtherObjectDto[];
        for( param in jsonParam2 ){
            [name] = param;
            //do something with the name
        }
        // continue the code
    }
}
```