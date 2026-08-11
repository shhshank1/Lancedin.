import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await schema.safeParseAsync(req.body);
    
    if (!result.success) {
      const formattedErrors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      
      res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
      return;
    }
    
    // Inject the validated, cleaned data back into request body
    req.body = result.data;
    next();
  };
};
