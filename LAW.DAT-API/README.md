# LAW.DAT-API
The contents of this git reflect the files of our AWS Lambda function, and are intended to run only in an AWS Lambda environment.

The JSON files listed in the outermost directory reflect the expected JSON object formats to be used when interacting with the API,
and will appear in several places within our UI files when API calls are made.

---------------------------------
How to setup the Lambda function
---------------------------------

Step 0:
If using a personal MongoDB cluster, replace the connection string in the .env file with your own.
The .env file should read something like "DB_URI=Your_Connection_String_Here"

Step 1:
Compress the contents of the 'Lambda' directory into a .zip file

Step 2:
On the AWS website, navigate to the AWS Lambda dashboard. Click the 'Create function' button.

Step 3:
Select 'Author from Scratch' template, enter your function name, and ensure you are using 'Node.js 14.x'
or more recent for the runtime. Click 'Create function' button when finished.

Step 4:
In the Code Source window within your newly created Lambda function, click 'Upload From' button and select '.zip file' from the options.
Select the .zip file made in Step 1 to upload, and click the 'Save' afterwards.

Step 5:
The 'index.js' file needs to be located in the root directory in order for the Lambda function to operate properly.
Drag the contents of the 'Lambda' folder into the root directory (whatever folder 'Lambda' is currently in).

Step 6:
Sometimes with .zip uploads, the .env file isn't recognized. Under the root folder, select File > New File. In this file,
include the "DB_URI=Your_Connection_String_Here" statement from Step 0. Select File > Save As... with '.env' as the filename.
Again, ensure it's saved in the root directory. Click the 'Save' button. Afterwards, click the 'Deploy' button after the files have been moved to save your changes.

Step 7:
Change AWS services to API Gateway, and on the default screen, click the 'Create API' button.
Select the 'Rest API' option that is NOT private by clicking it's 'Build API' button.
The description of the correct 'Rest API' option should read something along the lines of:
"Develop a REST API where you gain complete control over the request and response along with API management capabilities."

Step 8:
Ensure 'REST' is selected for the protocal, and 'New API' from the options following. Enter an API name, ensure the endpoint type is
'regional', and click the 'Create API' button. You should be brought to the Resources page of the newly created API.

Step 9:
Click the 'Actions' button and select 'Create Method' from the dropdown menu. Choose 'POST' from the empty dropdown, and click the
checkmark next to it afterwards.

Step 10:
In the new -POST-Setup screen, ensure the integration type is set to 'Lambda Function'. In the Lambda Function textbox below,
type in the name of your lamda function from Step 3 (it should autosuggest your function name if typed properly). Click the 'Save'
button after the function name is entered. Click the 'OK' button in the 'Add Permission to Lambda Function' popup window.

Step 11:
Click the 'Actions' button again, and select 'Enable CORS' from the dropdown menu. Do not change any of the default settings. Click
the button labeled 'Enable CORS and replace existing CORS headers'. In the 'Confirm method changes' popup window, click the button
'Yes, replace existing values'. You should see several lines with green checkmarks next to them once completed.

Step 12:
Click the 'Actions' button again, and select 'Deploy API'. Under 'Deployment Stage', select [New stage]. Enter a stage name
in the 'Stage name' text field, and click the 'Deploy' button. The screen displayed afterwars should display an 'Invoke URL' 
at the top of the page. Copy the URL listed there.

Step 13:
Within the LAW.DAT-UI files, navigate to and open '/LAW.DAT-UI/RiskAssessmentForm/my-app/src/crud.js'.
In this file, replace the URL for the 'url' const (line 18) with the URL copied from the previous step.
Save the changes to this file.

------

If everything was done correctly, the project should be configured to run using your AWS Lambda function and API Gateway.
Our API Gateway only uses a POST function due to the fact that we control the CRUD service through the JSON event sent
to the Lambda function. We know this is not typical API structure, but it worked for our project's needs. This project was
a learning experience for our team, and for many of us, it was the first attempt at creating our own API.