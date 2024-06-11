export class School {
  env: string;

  name: string;

  nick: string;

  constructor(env: string, nick: string, name: string) {
    this.env = env;
    this.name = name;
    this.nick = nick;
  }
}

const schools: School[] = [
  new School('stage', 'school1', 'towne avenue elementary school'),
  new School('perf', 'school1', 'mayo elementary school'),
  new School('qa', 'school1', 'van ness ave elem school'),
];

export default function getSchoolByNickAndEnv(env: string, nick: string) {
  return schools.find((s) => s.env === env && s.nick === nick);
}
