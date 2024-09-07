class CFIMetrics {
    constructor() {
      this.endpoint = 'https://hook.eu2.make.com/8xmc1xctwfw2ywob6k6dnbrvjejr5yzk';
    }
  
    async audit(dataPoint) {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPoint)
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send data point');
      }
  
      return response.json();
    }
  }
  
  export default CFIMetrics;