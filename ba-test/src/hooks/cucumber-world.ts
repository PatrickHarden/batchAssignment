import { IWorldOptions, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { PageConstructor } from '@scholastic/volume-test';
import { testConfig } from '../test-configuration';

export class VolumeTestWorld extends World {
  // Ignoring type definition requirement for this
  // eslint-disable-next-line
  [key: string]: any;

  page: <T>(constructorFunction: PageConstructor<T>) => T;
}

export const volumeTestWorld = (defaultWorld: World): VolumeTestWorld => {
  return defaultWorld as VolumeTestWorld;
};

// Ignoring type definition requirement for this
// eslint-disable-next-line
function volumeTestWorldConstructor(this: any, { attach, log, parameters }: IWorldOptions) {
  this.attach = attach;
  this.log = log;
  this.parameters = parameters;

  this.page = <T>(ConstructorFunction: PageConstructor<T>): T => {
    const config = this.config[ConstructorFunction.name];
    return new ConstructorFunction(this.browser, config);
  };
}

setDefaultTimeout(testConfig.cucumberTimeOut);
setWorldConstructor(volumeTestWorldConstructor);
