import { ModelsFirestore } from 'src/app/models/firestore.models';
import { ModelsAuth } from 'src/app/models/auth.models';
import { ModelsFunctions } from 'src/app/models/functions.models';
import { ModelsUsers } from 'src/app/models/users.models';
import { ModelsNotifications } from 'src/app/models/notifications.models';
import { ModelsAccess } from 'src/app/models/access.models';

export namespace Models {

    export import Firestore = ModelsFirestore;
    export import Auth = ModelsAuth;
    export import Functions = ModelsFunctions;
    export import User = ModelsUsers;
    //export import Tienda = ModelsTienda;
    export import Notifications = ModelsNotifications;
    export import AccessReq = ModelsAccess;

}
