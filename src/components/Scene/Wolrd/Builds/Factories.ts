// Constants
import { Names } from '@/utils/constants';

// Modules
import { StaticModelsBuilds } from '@/models/modules';

export default class Factories extends StaticModelsBuilds {
  constructor() {
    super(Names.factories);
  }
}
