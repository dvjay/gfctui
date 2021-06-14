import { EmptyComponent } from './components/empty/empty.component';
import { GraphContainerComponent } from './components/graph-container/graph-container.component';

const routes = [
    {
        path: 'network',
        component: EmptyComponent
    },
    {
        path: 'network/:entityid',
        component: GraphContainerComponent
    }
];