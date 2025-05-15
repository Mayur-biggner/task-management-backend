export const handleXmlParsingErrors = (err, req, res, next) => {
    console.error("XML Parsing Error:", err.message, err.stack); // Detailed logging
    if (
      err.name === "SyntaxError" || // General XML syntax errors
      err.message.includes("XML") || // Custom XML-related errors
      err.message.includes("Entity") || // XXE-related errors
      err.message.includes("DOCTYPE") || // DOCTYPE declarations
      err.message.includes("Invalid character entity") || // xml2js-specific error
      err.message.includes("Invalid XML") // Other invalid XML errors
    ) {
      return res.status(500).json({
        error: "Invalid access, bad request with XML",
      });
    }
    next(err); // Pass non-XML errors to the next error handler
  };