// Constants
import { Names } from '@/utils/constants';

// Modules
import { StaticModelModules } from '@/models/modules';

export default class Stations extends StaticModelModules {
  constructor() {
    super(Names.stations);
  }
}
