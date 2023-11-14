import { setUserTracking } from './cookiesService';

const initServices = {
  init() {
    setUserTracking(); // sets user visit data in cookies
  }
};

initServices.init();

export default initServices;
