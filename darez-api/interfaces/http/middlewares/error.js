module.exports = {
  // eslint-disable-next-line
  error: async (err, req, res, next) => {
    if ('isBoom' in err) {
      const { message, statusCode } = err.output.payload;
      return res.status(statusCode).json({ message });
    }
    if (process.env.NODE_ENV === 'local') {
      return res.status(500).json({ message: err.message, stack: err.stack });
    }
    return res.status(500).json({});
  },
};
