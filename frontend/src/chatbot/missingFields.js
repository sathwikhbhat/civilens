export function getMissingFields(persona) {
  const missing = [];

  if (!persona.geographic.state) missing.push("state");
  if (!persona.geographic.district) missing.push("district");
  if (!persona.demographics.age) missing.push("age");
  if (!persona.occupation.type) missing.push("occupation");
  if (!persona.economic.incomeBracket) missing.push("income");
  if (!persona.demographics.category) missing.push("category");

  if (
    persona.occupation.type === "FARMER" &&
    !persona.occupation.details?.farmerDetails?.landHolding?.value
  ) {
    missing.push("land");
  }

  return missing;
}