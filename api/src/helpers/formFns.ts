export const formFn = {
  convertToObject(obj: Record<string, any>, final: Record<string, any>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key.split(".").length > 1) {
        const splited_key = key.split(".") as (number | string)[];

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
            final[splited_key[0]][+splited_key[1]] = !isNaN(value as number)
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

  toSimpleObject(obj: Record<string, any>) {
    let newObj = {};
    this.convert(obj, newObj);
    return newObj;
  },
  toNormalObject(arg: Record<string, any>) {
    const filteredObj = {};
    this.convertToObject(arg, filteredObj);
    return filteredObj;
  },

  convert(obj: Record<string, any>, newObj: Record<string, any>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) {
          value.forEach((item, i) => {
            // if (item instanceof File) {
            //   formData.append(`${key}.${i}`, item, item.name);
            // } else
            if (!Array.isArray(item) && typeof item === "object") {
              const obj = {};
              Object.entries(value).forEach(([k, v], i1) => {
                Object.assign(obj, { [`${key}.${k}`]: v });
              });
              this.convert(obj, newObj);
            } else if (Array.isArray(item)) {
              const obj = {};
              item.forEach((el, ind) => {
                Object.assign(obj, { [`${key}.${i}.${ind}`]: el });
              });
              this.convert(obj, newObj);
            } else {
              Object.assign(newObj, { [`${key}.${i}`]: item });
            }
          });
        } else {
          Object.assign(newObj, { [key]: [] });
        }
      } else if (typeof value === "boolean") {
        Object.assign(newObj, { [key]: JSON.stringify(value) });
      }
      // else if (value instanceof File) {
      //   newObj.append(key, value, value.name);
      // }
      else if (!Array.isArray(value) && typeof value === "object") {
        if (Object.keys(value)?.length) {
          const obj = {};
          Object.entries(value).forEach(([k, v]) => {
            Object.assign(obj, { [`${key}.${k}`]: v });
          });
          this.convert(obj, newObj);
        } else {
          Object.assign(newObj, { [key]: "" });
        }
      } else if (typeof value === "string" || typeof value === "number") {
        Object.assign(newObj, { [key]: value });
      } else if (value === undefined) {
        Object.assign(newObj, { [key]: "" });
      }
    });
  },
  reConvert(obj: Record<string, any>) {
    return this.toNormalObject(this.toSimpleObject(obj));
  },
};
