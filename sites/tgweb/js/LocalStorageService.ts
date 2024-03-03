import { IComponent } from "arrmatura/types";

const storage = window.localStorage;

export class LocalStorageService implements IComponent {
  key = 'app:state';
  [key: string]: unknown;

  init() {
    const sdata = storage.getItem(this.key) || "null";
    const data = JSON.parse(sdata);

    return { data, sdata };
  }

  onStore(delta = {}, { data, sdata }): { data?: undefined; sdata?: undefined } | { data: any; sdata: string } {
    data = { ...data, ...delta };
    const ssdata = JSON.stringify(data);

    if (sdata === ssdata) {
      return {};
    }

    storage.setItem(this.key, ssdata);

    return { data, sdata: ssdata };
  }
}
