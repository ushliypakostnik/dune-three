// Constants
import { Names } from '@/utils/constants';

// Modules
import { StaticModelModules } from '@/models/modules';

export default class Command extends StaticModelModules {
  constructor() {
    super(Names.command);
  }
}
