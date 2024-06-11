# ba-server

The back end client for BA

## Dependencies
* [Java 17](https://www.oracle.com/java/technologies/downloads/)
* [Maven 3.0+](https://maven.apache.org/)

## First time setup
```
git clone git@bitbucket.org:scholastic/lit-platform-ba-web.git
cd ba-web
git checkout develop
mvn clean install
```

## Running on your local
1. Command line
```
java -jar target/ba-server-0.0.1-SNAPSHOT.jar
```
2. IDE (e.g. [Spring Tools](https://spring.io/tools))
```
1. File > Import > Maven > Existing Maven Project
2. Browse for the ba-server directory and complete the import with defaults
3. Right click on ba-server in Project Explorer and select Run As > Spring Boot App
```

## Running Tests + Coverage
```
cd ba-server
mvn clean install
```
Coverage results can be viewed by opening `target/site/jacoco/index.html` in a browser.

## Linting
If you are using an IDE, install the respective [SonarLint plugin](https://www.sonarlint.org/).