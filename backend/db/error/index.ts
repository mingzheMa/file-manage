import user from "./user";
import fileStructure from "./fileStructure";
import file from "./file";

type error = {
  code: string;
  message: string;
};

interface Errors {
  [key: number | string]: error;
}

const addErrors = (function () {
  let moduleIndex = 1;
  return function (moduleErrors: Errors) {
    Object.entries(moduleErrors).forEach((kv) => {
      errors[moduleIndex * 1000 + Number(kv[0])] = kv[1];
    });

    moduleIndex++;
  };
})();

const errors: Errors = {};
addErrors(user) // 100*
addErrors(fileStructure) // 200*
addErrors(file) // 300*

export default errors;
