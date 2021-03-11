import {storiesOf} from '@storybook/react';
import React from 'react';
import DashboardHeader from './components/Header/DashboardHeader';


storiesOf('DashboardHeader',module)
    .add('default',()=><DashboardHeader userName='lOX ivanovich'/>);