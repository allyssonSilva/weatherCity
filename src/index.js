import Menu from './pages/main';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    Main: Menu,
    
  })
);

export default Routes;