export const formFn = {
  toFormData(arg: Record<string, any>) {
    const formData = new FormData();
    this.convertToFromData(arg, formData);
    return formData;
  },

  toObject(arg: FormData): Record<string, any> {
    const objfromEntries = Object.fromEntries(arg);
    const filteredObj = {};
    this.convertToObject(objfromEntries, filteredObj);
    return filteredObj;
  },

  convertToFromData(arg: Record<string, any>, formData = new FormData()) {
    Object.entries(arg).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        formData.append(key, "");
      } else if (Array.isArray(value)) {
        if (value.length) {
          value.forEach((item, i) => {
            if (item instanceof File) {
              formData.append(`${key}.${i}`, item, item.name);
            } else if (!Array.isArray(item) && typeof item === "object") {
              const obj = {};
              Object.entries(value).forEach(([k, v], i1) => {
                Object.assign(obj, { [`${key}.${k}`]: v });
              });
              this.convertToFromData(obj, formData);
            } else if (Array.isArray(item)) {
              const obj = {};
              item.forEach((el, ind) => {
                Object.assign(obj, { [`${key}.${i}.${ind}`]: el });
              });
              this.convertToFromData(obj, formData);
            } else {
              formData.append(`${key}.${i}`, item);
            }
          });
        } else {
          formData.append(key, "");
        }
      } else if (typeof value === "boolean") {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (typeof value === "object" && Object.keys(value)) {
        if (Object.keys(value)?.length) {
          const obj = {};
          Object.entries(value).forEach(([k, v]) => {
            Object.assign(obj, { [`${key}.${k}`]: v });
          });
          this.convertToFromData(obj, formData);
        } else {
          formData.append(key, "");
        }
      } else if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString());
      } else if (value === undefined) {
        formData.append(key, "");
      } else formData.append(key, "");
    });
  },

  convertToObject(obj: Record<string, any>, final: Record<string, any>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key.split(".").length > 1) {
        const splited_key: (number | string)[] = key.split(".");

        // array
        if (!isNaN(splited_key[1] as number)) {
          if (!final[splited_key[0]]) {
            final[splited_key[0]] = [];
          }
          if (splited_key[2]) {
            const my_obj = {
              [splited_key.slice(1).join(".")]: value,
            };
            if (!final[splited_key[0]][splited_key[1]]) {
              if (!isNaN(splited_key[2] as number)) {
                final[splited_key[0]][splited_key[1]] = [];
              } else {
                final[splited_key[0]][splited_key[1]] = {};
              }
            }
            this.convertToObject(my_obj, final[splited_key[0]]);
          } else {
            final[splited_key[0]][+splited_key[1]] = !isNaN(value)
              ? +value
              : value;
          }
        }
        // or object
        else {
          if (!final[splited_key[0]]) {
            final[splited_key[0]] = {};
          }
          if (splited_key[2]) {
            const my_obj = {
              [splited_key.slice(1).join(".")]: value,
            };
            if (!final[splited_key[0]][splited_key[1]]) {
              if (!isNaN(splited_key[2] as number)) {
                final[splited_key[0]][splited_key[1]] = [];
              } else {
                final[splited_key[0]][splited_key[1]] = {};
              }
            }
            this.convertToObject(my_obj, final[splited_key[0]]);
          } else {
            final[splited_key[0]][splited_key[1]] = !isNaN(value)
              ? +value
              : value;
          }
        }
      } else {
        final[key] = value;
      }
    });
  },

  uniquObject(obj: Record<string, any>) {
    return this.toObject(this.toFormData(obj));
  },

  uniquFormData(fd: FormData) {
    return this.toFormData(this.toObject(fd));
  },
};
