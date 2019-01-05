import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.projet{
   export class Scrutateur extends Participant {
      scrutateurId: string;
      name: string;
   }
   export class PV extends Asset {
      pvId: string;
      nbVotants: string;
      owner: Scrutateur;
      listeDesVoix: Voix[];
      nomBureau: string;
   }
   export class Voix {
      nbVoix: number;
      candidat: string;
   }
// }
