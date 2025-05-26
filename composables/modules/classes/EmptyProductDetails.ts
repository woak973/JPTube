import { Helpers, APIResponseTypes, Misc } from 'youtubei.js';

export default class EmptyProductDetails extends Helpers.YTNode {
  static override type = 'EmptyProductDetails';

  title: Misc.Text;

  constructor(data: APIResponseTypes.RawNode) {
    super();
    this.title = new Misc.Text(data.title);
  }
}
