import pymysql

db_config = {
    'host':'b4dfwk59zduraz1tloo6-mysql.services.clever-cloud.com',
    'user': 'uxkg4t8mhop341my',
    'password': 'gzucUtkPqaX72hl6dGn3',
    'db': 'b4dfwk59zduraz1tloo6',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}
# Function to get database connection
def get_db_connection():
    try:
        conn = pymysql.connect(**db_config)
        try:
            print("Database connection established")
        except Exception:
            pass
        return conn
    except Exception as e:
        print(f"Failed to establish database connection: {e}")
        raise

mailSecret = {
     'SMTP_SERVER': 'smtp.gmail.com', 
    'SMTP_PORT' : 587,
    'SMTP_USERNAME' :'raushanranjan841@gmail.com',
    'SMTP_PASSWORD' : 'pasgjlhincteuhpt',    
  'SMTP_SENDER': 'raushanranjan841@gmail.com'   
}

class Config:
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 587
    SMTP_USERNAME = 'richakumari1022003@gmail.com'
    SMTP_PASSWORD = 'zumipnibipiacqou'
    SMTP_SENDER = 'richakumari1022003@gmail.com'