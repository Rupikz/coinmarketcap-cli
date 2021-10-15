import { InputInterface } from 'src/interfaces/input.interface';

export abstract class AbstractAction {
  public abstract handle(
    inputs?: InputInterface[],
    options?: InputInterface[],
  ): Promise<void>;
}
