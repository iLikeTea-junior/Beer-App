import express from 'express';
import * as data from './data.js';
import cors from 'cors';

import routers from './routers/index.js';
import { sseHandler } from './event.js';

// Create an express app
const app = express();

app.get('/', (req, res) => {
	res.send('Server is running');
});

// Configure express to automatically decode JSON bodies
app.use(express.json());

// This lets browsers know that any website is allowed to make requests to our API.
// In practice we'd rarely want this to be open, instead you'd define which websites
// you allow to make requests to your API.
app.use(cors({
	// This would work for normal routes ONLY!
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'DELETE']
}));


// Make sure tables and initial data exist in the database
data.applySchema();

// This route causes the database to reset to what's in `schema.sql`.
// This should *not* be enabled in production, it's for testing only.
if (process.env.ALLOW_RESET_DATABASE) {
	app.put('/reset_database', function(req,rsp) {
		data.dropAllTables();
		data.applySchema();
		rsp.json({});
	});
}

// Include the routers
app.use('/api', routers);

// when opening a SSE connection it always would need a course to allow live connection between browser and server.
app.get('/events', sseHandler);

// Start accepting requests
const listener = app.listen(process.env.PORT || 3000, "0.0.0.0", function () {
	console.log(`Server running at http://${listener.address().address}:${listener.address().port}`);
});
