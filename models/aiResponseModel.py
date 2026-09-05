import config

class AIResponseModel:
    @staticmethod
    def get_portfolios_by_user_id(user_id):
        conn = config.get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT * FROM ai_responses WHERE user_id = %s
                    """,
                    (user_id,)
                )
                return cursor.fetchall()
        finally:
            conn.close()

    @staticmethod
    def save_ai_response(user_id,title, data):
        conn = config.get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO ai_responses (user_id, title, html_content)
                    VALUES (%s, %s, %s)
                    """,
                    (user_id, title, data)
                )
                conn.commit()
                portfolio_id = cursor.lastrowid if hasattr(cursor, 'lastrowid') and cursor.lastrowid else None
                if not portfolio_id:
                    cursor.execute("SELECT LAST_INSERT_ID() AS id")
                    row = cursor.fetchone()
                    portfolio_id = row['id'] if row and 'id' in row else None
                return portfolio_id
        finally:
            conn.close()
    
    @staticmethod
    def get_portfolio_by_id(portfolio_id):
        conn = config.get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT * FROM ai_responses WHERE id = %s
                    """,
                    (portfolio_id,)
                )
                return cursor.fetchone()
        finally:
            conn.close()
    @staticmethod
    def save_toDB(portfolio_id, content):
        conn = config.get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE ai_responses SET html_content = %s WHERE id = %s
                    """,
                    (content, portfolio_id)
                )
                conn.commit()
        finally:
            conn.close()
    
    @staticmethod
    def delete_portfolio(portfolio_id):
        conn = config.get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM ai_responses WHERE id = %s
                    """,
                    (portfolio_id,)
                )
                conn.commit()
                return True
        finally:
            conn.close()