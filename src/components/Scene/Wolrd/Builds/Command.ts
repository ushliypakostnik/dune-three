// Constants
import { Names } from '@/utils/constants';

// Modules
import { StaticModelsBuilds } from '@/models/modules';

export default class Command extends StaticModelsBuilds {
  constructor() {
    super(Names.command);
  }
}
