import {Router} from '@vaadin/router';

export function initRoutes(root){
  const router = new Router(root);
router.setRoutes([
  {path: '/', component: 'welcome-page'},
  {path: '/create', component: 'create-page'},
  {path: '/home', component: 'home-page'},
  {path: '/report', component: 'report-page'},
  {path: '/misdatos', component: 'datos-page'},
  {path: '/petsreported', component: 'petsreported-page'},
  {path: '/editpet', component: 'editpet-page'},
]);
}
