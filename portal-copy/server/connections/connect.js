const mongoose = require('mongoose');

const connectToOnlineDB = async () => {
  const maxAttemptsOnline = 2; 
  const maxAttemptsLocal = 2;  
  let attemptsOnline = 0;
  let attemptsLocal = 0;

  while (attemptsOnline < maxAttemptsOnline) {
    try {
      const onlineURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERID}/?retryWrites=true&w=majority`;
      if (!onlineURI) {
        throw new Error('MONGODB_CONNECT_URI is not defined in the environment variables.');
      }

      await mongoose.connect(onlineURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Connected to Cloud MongoDB Server');
      return; 
    } catch (error) {
      console.error('Online Connection ERROR:', error.message);
      attemptsOnline++;
      console.log(`Attempting to reconnect to the online MongoDB server. Attempt ${attemptsOnline} of ${maxAttemptsOnline}...`);
      await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
  }

  console.error(`Failed to connect to the online MongoDB server after ${maxAttemptsOnline} attempts. Trying local connection...`);

  while (attemptsLocal < maxAttemptsLocal) {
    try {
      const localURI = 'mongodb://0.0.0.0:27017/data1'; 
      await mongoose.connect(localURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Connected to Local MongoDB Server');
      return; 
    } catch (error) {
      console.error('Local Connection ERROR:', error.message);
      attemptsLocal++;
      console.log(`Attempting to reconnect to the local MongoDB server. Attempt ${attemptsLocal} of ${maxAttemptsLocal}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error(`Failed to connect to the local MongoDB server after ${maxAttemptsLocal} attempts. Exiting...`);
  process.exit(1);
};

module.exports = connectToOnlineDB;
