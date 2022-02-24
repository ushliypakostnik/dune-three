// Constants
import { Names } from '@/utils/constants';

// Modules
import { StaticModules } from '@/models/modules';

export default class Command extends StaticModules {
  constructor() {
    super(Names.command);
  }
}
