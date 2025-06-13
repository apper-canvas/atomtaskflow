import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'TaskFlow',
    path: '/home',
    icon: 'CheckSquare',
    component: Home
  }
};

export const routeArray = Object.values(routes);