class Config():
    DEBUG=False
    SQLALCHEMY_TRACK_MODIFICATION =True
    
class LocalDevelopmentConfig(Config):
    #configuration
    SQLALCHEMY_DATABASE_URI="sqlite:///quiz.sqlite3"
    DEBUG=True
    
    #for security
    SECRET_KEY= "secret-key"
    SECURITY_PASSWORD_HASH="bcrypt"
    SECURITY_PASSWORD_SALT="password_salt"
    WTF_CSRF_ENABLED=False
    SECURITY_TOKEN_AUTHENTICATION_HEADER="Authentication-Token"  
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 300   
    
    