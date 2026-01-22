import Joi from "joi";

describe("Category Validation Schema", () => {
  const categoryValidationSchema = Joi.object({
    description: Joi.string().required(),
  });

  describe("Happy Path", () => {
    it("should validate valid category data", () => {
      const validData = { description: "Alimentação" };
      const { error } = categoryValidationSchema.validate(validData);

      expect(error).toBeUndefined();
    });

    it("should validate category with special characters", () => {
      const validData = { description: "Café & Restaurante" };
      const { error } = categoryValidationSchema.validate(validData);

      expect(error).toBeUndefined();
    });

    it("should validate category with numbers", () => {
      const validData = { description: "Category 123" };
      const { error } = categoryValidationSchema.validate(validData);

      expect(error).toBeUndefined();
    });

    it("should validate category with unicode characters", () => {
      const validData = { description: "日本語カテゴリ" };
      const { error } = categoryValidationSchema.validate(validData);

      expect(error).toBeUndefined();
    });
  });

  describe("Sad Path", () => {
    it("should fail validation when description is missing", () => {
      const invalidData = {};
      const { error } = categoryValidationSchema.validate(invalidData);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"description" is required');
    });

    it("should fail validation when description is empty string", () => {
      const invalidData = { description: "" };
      const { error } = categoryValidationSchema.validate(invalidData);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"description" is not allowed to be empty');
    });

    it("should fail validation when description is not a string", () => {
      const invalidData = { description: 123 };
      const { error } = categoryValidationSchema.validate(invalidData);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"description" must be a string');
    });

    it("should fail validation when description is null", () => {
      const invalidData = { description: null };
      const { error } = categoryValidationSchema.validate(invalidData);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"description" must be a string');
    });

    it("should fail validation when description is undefined", () => {
      const invalidData = { description: undefined };
      const { error } = categoryValidationSchema.validate(invalidData);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"description" is required');
    });

    it("should fail validation when passing extra fields without strict mode", () => {
      const dataWithExtra = { description: "Valid", extraField: "not allowed" };
      const strictSchema = categoryValidationSchema.options({ allowUnknown: false });
      const { error } = strictSchema.validate(dataWithExtra);

      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"extraField" is not allowed');
    });
  });
});
