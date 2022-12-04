import {ComponentB} from '../componentB/componentB';

export class ComponentA {
    public readonly type = 'root';

    public readonly relative = new ComponentB()
}
