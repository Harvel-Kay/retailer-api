const allowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
function validNumber(field, stateErr) {
  const against = [];
  const errors = { ...stateErr };
  const field_name = field.name;
  if (field.value === "") errors[field.name] = "Field can't be empty";
  for (let val of field.value) {
    if (against.every((item) => allowed.includes(item) && item !== "."))
      delete errors[field.name];
    if (!allowed.includes(val))
      errors[field_name] = "Field value should be a number";
    if (against.includes(val) && val === ".")
      errors[field_name] = "Only one period '.' is allowed";

    against.push(val);
  }

  return errors;
}

function thereErrors(err) {
  return objKeys(err) > 0;
}

function objKeys(obj) {
  return Object.keys(obj).length;
}

module.exports.objKeys = objKeys;
module.exports.validNumber = validNumber;
module.exports.thereErrors = thereErrors;
