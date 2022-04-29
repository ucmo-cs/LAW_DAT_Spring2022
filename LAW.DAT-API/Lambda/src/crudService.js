import { MongoClient } from 'mongodb';

// Establish a connection to the MongoDB client (referenced in main execution statement))
export async function connectToCluster(uri) {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }




// PRIMARY FUNCTION CALL
// This function houses the logic to determine what API call is being made, call upon the corresponding method, and returning the result of the API call

 export async function API_Handler(event) {
    const uri = process.env.DB_URI;
    let mongoClient;
 
    try {
        // This section remains constant. No need to change
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('Senior_Project');
        const collection = db.collection('Risk_Assessment');
        let response;
        
        //This section will determine what CRUD operation is being made according to the event case, and call the corresponding function
        switch(true) {
            
            // CREATE / POST
            // If the httpMethod is 'POST', the body of the event case will be submitted into the database.
            
            case event.params.httpMethod === 'POST':
                    response = await submitForm(collection, event.body);
                break;
            
            
            // READ / GET
            // If the httpMethod is 'GET', and the amount is 'ALL', all form submissions will be returned in the API call.
            case event.params.httpMethod === 'GET' && event.params.amount === 'ALL':
              response = await findAll(collection);
              break;
             
            // If the httpMethod is 'GET' and the amount is 'ONE', the database will be queried for the specified key and return the first result found, if any.
            case event.params.httpMethod === 'GET' && event.params.amount === 'ONE':
                response = await findOne(collection, event.params.key);
                break;
            
                
            // Update an existing entry in the database    
            case event.params.httpMethod === 'PATCH':
              response = await update(collection, event.params.key, event.params.updatedFields);
              break;
            
            
            // Delete an existing entry in the database
            case event.params.httpMethod === 'DELETE' && event.params.amount === 'ONE':
              response = await remove(collection, event.params.key);
              break;
              
            // Delete ALL existing documents in the collection
            case event.params.httpMethod === 'DELETE' && event.params.amount === 'ALL':
                response = await removeAll(collection);
                break;
            
            // The default response for improper API call
            default:
              response = {
                  "status": "not found"
              }
        }

        // Return a status of the API call to the user
        return response;

    } finally {
        await mongoClient.close();
    }
 }


// =====================
// === CREATE / POST ===
// =====================
 export async function submitForm(collection,event) {
    const result = await collection.insertOne(event);
    const response = {
        statusCode: 200,
        request: 'POST',
        body: event.header
    };
    return response;
 }
 
 // =================
// === READ / GET ===
// ==================
 export async function findAll(collection) {
     const result = await collection.find(
         {})
         .project({header: 1})
         .toArray();
     const response = {
         statusCode: 200,
         request: 'GET',
         body: result
     }
     return response;
}



export async function findOne(collection, tripNum) {
     const result = await collection.findOne(
         {'header.tripNum': tripNum
         });
     const response = {
         statusCode: 200,
         request: 'GET',
         key: tripNum,
         body: result
     }
     return response;
}

export async function check(collection, tripNum) {
    const result = await collection.findOne(
         {'header.tripNum': tripNum
         });
    if(result != null)
        return true;
    else
        return false;
        
}


 // =====================
// === UPDATE / PATCH ===
// ======================
export async function update(collection, tripNum, updatedFields) {
    const result = await collection.update(
        {'header.tripNum':tripNum},
        { $set: updatedFields}
        );
    const response = {
        statusCode: 200,
        request: 'PATCH',
        key: tripNum,
        body: result
    }
    return response;
}

 // =============
// === DELETE ===
// ==============
export async function remove(collection, tripNum) {
    const result = await collection.deleteOne(
        {'header.tripNum':tripNum});
    const response = {
        statusCode: 200,
        request: 'DELETE',
        key: tripNum,
        body: result
    }
    return response;
}


export async function removeAll(collection) {
    const result = await collection.deleteMany({});
    const response = {
        statusCode: 200,
        request: 'DELETE',
        body: result
    }
    return response;
}