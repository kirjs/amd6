import {ChildComponent} from './child/child-component';
import {of} from 'rxjs'

export class ComponentB {
    public readonly type = 'root';

    public readonly child = new ChildComponent();

    public readonly stream$ = of([]);
}
