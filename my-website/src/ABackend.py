from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import jwt
import datetime
import requests
from bs4 import BeautifulSoup
import random
from dotenv import load_dotenv
import os


app=Flask(__name__)
#remember to change the passwordChange to change password forever, right now it is temprorary and resets on server restart

CORS(app, resourse={r"/*": {"origins": "https://localhost:3000"}})
# Secret key for JWT
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
databasepass = os.getenv('password')
@app.route("/3000", methods=["POST"])
def handling_data():
    data = request.get_json()  # Get JSON data from the request
    type= data.get('type')
    # Establish the connection
    connection = mysql.connector.connect(
        host="localhost",        # Your host, e.g., localhost or AWS RDS instance
        user="root",    # Your MySQL username
        password=databasepass,# Your MySQL password
        database="newdata" # The database you want to connect to
    )
    
    cursor = connection.cursor()

    
    if (type=="salt"):
        username = data.get('username')
        email = data.get('email')
        if(email == True):
            select_query = """
            SELECT email_hash FROM users WHERE email_hash = %s;
            """
            cursor.execute(select_query, (str(username),))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, email does not exist or password is incorrect"})
            else:
                salt=str(result[0])
                return jsonify({"status": "success", "message": "Salt recieved","salt":salt})
        elif(email == False):
            select_query = """
            SELECT salt FROM users WHERE username_hash = %s;
            """
            cursor.execute(select_query, (str(username),))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, username does not exist or password is incorrect"})
            else:
                salt=str(result[0])
                return jsonify({"status": "success","message": "Salt recieved","salt":salt})
        
    
    if (type== "signin"):
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if(email == True):
            select_query = """
            SELECT email_hash, password_hash FROM users WHERE email_hash = %s and password_hash = %s;
            """
            cursor.execute(select_query, (username, password))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, email does not exist or password is incorrect"})
            else:
                token = jwt.encode({'username': username,"emailExists":email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, SECRET_KEY)
                return jsonify({"status": "success", "message": "Sign in with email successful", "token": token})
        elif(email == False):
            select_query = """
            SELECT username_hash, password_hash FROM users WHERE username_hash = %s and password_hash = %s;
            """
            cursor.execute(select_query, (username, password))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, username does not exist or password is incorrect"})
            else:
                token = jwt.encode({'username': username,"emailExists":email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, SECRET_KEY)
                return jsonify({"status": "success", "message": "Sign in successful", "token": token})
        else:
            return jsonify({"status": "failure", "message": "Sign in failed, due to an error on our end please make a ticket or send an email to arsh.singh.sandhu1@gmail.com"})
    elif (type == "register"):
        username = data.get('username')
        password = data.get('password')
        salt=data.get('salt')
        email = data.get('email')
        select_query_email = """
        SELECT email_hash from users WHERE email_hash = %s;
        """
        cursor.execute(select_query_email, [email])
        result = cursor.fetchone()
        if result is not None:
            cursor.close()
            connection.close()
            return jsonify({"status": "failure", "message": "Sign up failed, email is already used"})
        select_query_user = """
        SELECT username_hash from users WHERE username_hash = %s;
        """
        cursor.execute(select_query_user, [username])
        result = cursor.fetchone()
        if result is not None:
            cursor.close()
            connection.close()
            return jsonify({"status": "failure", "message": "Sign up failed, username is already used"})
        
        insert_query = """
        INSERT INTO users (username_hash, password_hash, email_hash,salt)
        VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (username, password, email, salt))
        


        connection.commit()
        cursor.close()
        # Close the connection when done
        connection.close()
        token = jwt.encode({'username': username,"emailExists":False, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, SECRET_KEY)
        return jsonify({"status": "success", "message": "Account created!", "token": token})
    elif (type == 'changePassword'):
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        salt="default"
        result=None
        if email==True:
            select_query_user = """
            SELECT salt from users WHERE email_hash = %s;
            """
            cursor.execute(select_query_user, [username])
            result = cursor.fetchone()
        else:
            select_query_user = """
            SELECT salt from users WHERE username_hash = %s;
            """
            cursor.execute(select_query_user, [username])
            result = cursor.fetchone()
        if result is None:
            cursor.close()
            connection.close()
            return jsonify({"status": "failure", "message": "Change password failed, Account does not exists"})
        salt=result[0]
        insert_query = """
        insert into passReq (username,email_exists,salt,passwordChangeReq)
        values (%s,%s, %s, %s);
        """
        cursor.execute(insert_query, (username, email,salt, password))
        connection.commit()
        cursor.close()
        # Close the connection when done
        connection.close()
        rows_affected = cursor.rowcount
        if rows_affected==0:
            return jsonify({"status": "failure", "message": "Change password failed, email does not exist"})
        else:
            return jsonify({"status": "success", "message": "Password Request sent!"})
    elif (type == 'LetterUser'):

        movie=get_random_movie(data.get('username'))
        if movie == "This user does not exist" or movie == "User has nothing in wishlist":
            return jsonify({"status": "failure", "message": movie})
        
        movie_link = 'https://letterboxd.com/film/'+movie
        emailExists=(data.get('emailExists'))
        account=(data.get('account'))
        data,result=get_movie_data(movie_link,emailExists,account,cursor,connection)
        cursor.close()
        connection.close()
        return jsonify({"status":"success", "message": movie, "data":data,"result":result})
    elif(type == "LoadPrevMovie"):
        emailExists = data.get('emailExists')
        account = data.get('account')
        movieID = data.get('movieID')
        data=load_prev_movie(movieID,emailExists,account,cursor,connection)
        return jsonify({"status":"success", "message": "not finished","data":data})
    elif (type=="ADMINSALT"):
        username=data.get('username')
        select_query_user = """
        SELECT salt from adminusers WHERE username_hash = %s;
        """
        cursor.execute(select_query_user, [username])
        result = cursor.fetchone()
        if result is None:
            return jsonify({"status": "failure", "message": "Change password failed, Account does not exists"})
        salt=str(result[0])
        cursor.close()
        connection.close()
        return jsonify({"status":"success", "message": "not finished","salt":salt})
    elif (type=="ADMIN"):
        username = data.get('username')
        password = data.get('password')
        select_query = """
        SELECT * from adminusers where username_hash = %s and password_hash = %s;
        """
        cursor.execute(select_query, (username,password))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        if result is None:
            return jsonify({"status": "failure", "message": "Admin login failed, Account does not exists"})
        return jsonify({"status":"success", "message": "not finished"})
    elif (type=="GetChangePassReqs"):
        select_query = """
        SELECT username,email_exists,salt,passwordChangeReq FROM passreq;
        """
        cursor.execute(select_query)
        result = cursor.fetchall()        
        cursor.close()
        connection.close()
        return jsonify({"status":"success","message" : "Got requests","result":result})
    elif (type == "ADMINAPPROVE"):
        username=data.get('username')
        emailExists = str(data.get('email_exists'))
        passwordReq=data.get('passwordReq')
        originalPass=data.get('originalPass')
        if emailExists=='0':
            update_query = """
            UPDATE users
            SET password_hash = %s
            WHERE username_hash=%s;
            """ 
        else:
            update_query = """
            UPDATE users
            SET password_hash = %s
            WHERE email_hash=%s;
            """ 

        cursor.execute(update_query, (passwordReq,username))
        connection.commit()
        rows_affected = cursor.rowcount
        delete_query = """
        delete from passreq where username=%s and email_exists = %s and passwordChangeReq=%s;
        """
        cursor.execute(delete_query, (username,emailExists,originalPass))
        connection.commit()
        cursor.close()
        connection.close()
        if rows_affected==0:
            return jsonify({"status":'failure',"message":'failed bruhhh'})
        return jsonify({"status":"success","message" : "Got requests"})
    elif (type=='ADMINDISAPPROVE'):

        username=data.get('username')
        emailExists = str(data.get('email_exists'))
        passwordReq=data.get('passwordReq')
        originalPass=data.get('originalPass')
        delete_query = """
        delete from passreq where username=%s and email_exists = %s and passwordChangeReq=%s;
        """
        cursor.execute(delete_query, (username,emailExists,originalPass))
        connection.commit()
        cursor.close()
        connection.close()
        if rows_affected==0:
            return jsonify({"status":'failure',"message":'failed bruhhh'})
        return jsonify({"status":"success","message" : "Got requests"})
    else:
        cursor.close()
        connection.close()
        return jsonify({"status": "failure", "message": "Sign up failed, due to an error on our end please make a ticket or send an email to Arsh.singh.sandhu1@gmail.com"})
    




def load_prev_movie(movieID,emailExists,account,cursor,connection):
    select_query = """
    SELECT director,title,releaseYear,rating,tagline,movie_description,poster_url,trailer,wheretowatch FROM movies
    WHERE movieID=%s
    """
    cursor.execute(select_query,[movieID])
    r=cursor.fetchall()
    r=r[0]
    theme = r[0]
    backgroundImage=r[0]
    director=r[0]
    title=r[1]
    year=r[2]
    rating=r[3]
    tagline=r[4]
    description=r[5]
    posterImg=r[6]
    href=r[7]
    link=r[8]
    
    data={
        "theme" :theme,
        "background": backgroundImage,
        "director" : director,
        "title" : title,
        "releaseYear" : year,
        "rating" : rating,
        "tagline" : tagline,
        "description": description,
        "posterImg" : posterImg,
        "trailer" : href,
        "whereToWatch" : link
        
    }


    cursor.close()
    connection.close()
    return data
def get_movie_data(movie_link,emailExists,account,cursor,connection):


    response = requests.get(movie_link)
    soup = BeautifulSoup(response.content, 'html.parser')
    id=soup.find('p',class_="text-link text-footer")
    id=soup.find_all('a',class_="micro-button track-event")
    id=str(id[-1].get('href').split('/')[-2])
	
    #description = soup.find('div', class_='film-poster')
    head = soup.find('head')
    # Check if the request was successful
    
    director=""
    backgroundImage=""
    title=""
    rating=""
    tagline=""
    description=""
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find the div by class and ID
        head = soup.find('head')
        backgroundImage=head.find('meta',attrs={'property': 'og:image'})
        director=head.find('meta',attrs={'name': 'twitter:data1'})
        rating=head.find('meta',attrs={'name': 'twitter:data2'})
        theme=head.find('meta',attrs={'name':'theme-color'})
        # <meta name="theme-color" content="#14181C">
        if rating==None:
            rating="Not enough ratings"
        else:
            rating=str(rating['content'])
        tagline=soup.find('h4',class_='tagline')
        if tagline==None:
            tagline = ""  
        else:
            tagline=str(tagline.text)
        description=head.find('meta',attrs={'name': 'twitter:description'})
        titleDetails=soup.find('section',class_='film-header-group')
        title=titleDetails.find('span',class_='name js-widont prettify')

        if backgroundImage==None:
            backgroundImage=""
        else:
            backgroundImage=str(backgroundImage['content'])
        if title==None:
            title=""
        else:
            title=str(title.text)
        
        if director==None:
            director=""
        else:
            text=" Directed by "
            director=str(director['content'])
            text+=director
        title+=text
        if description==None:
            description=""
        else:
            description=str(description['content'])
        if theme==None:
            theme=""
        else:
            theme=str(theme['content'])
        
        


    
    titleDetails=soup.find('section',class_='film-header-group')
    year=titleDetails.find('div',class_='releaseyear')
    year=year.find('a').text
    titleDetails=titleDetails.find('span',class_="name js-widont prettify")

    
    
    div = soup.find('div', class_='col-6 gutter-right-1 col-poster-large', id='js-poster-col')
    video=div.find('div',class_='header')
    video=video.find('a',class_='play track-event js-video-zoom')
    if video!=None:
        href=video.get('href')
    else:
        href=""
    name=titleDetails.text.replace(' ','-').lower()
    link='https://letterboxd.com/film/'+name+'/watch/'

    
    

    poster = soup.findAll('a', class_='micro-button track-event')
    if poster==None:
        poster=["",""]
        url=""
        posterImg=""
    else:
        url=str(poster[-1].get('href'))
        

        # Send a GET request to the URL
        response = requests.get(url)
        posterImg=""
        # Check if the request was successful
        if response.status_code == 200:
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            # Find the div by class and ID
            div_content=soup.find('div',class_='blurred')
            if div_content!=None:
                div_content=div_content.find('img')
                div_content=div_content.get('src')
            # Print the div content
            else:
                div_content = ""

            
            posterImg=str(div_content)

    data={
        "theme" :theme,
        "background": backgroundImage,
        "director" : director,
        "title" : title,
        "releaseYear" : year,
        "rating" : rating,
        "tagline" : tagline,
        "description": description,
        "posterImg" : posterImg,
        "trailer" : href,
        "whereToWatch" : link
        
    }

    if emailExists:
        select_query_user = """
        SELECT movie_id from users WHERE email_hash = %s;
        """
    else:
        select_query_user = """
        SELECT movie_id from users WHERE username_hash = %s;
        """

    cursor.execute(select_query_user, [account])
    result = cursor.fetchone()
    
    
    if result==None or result[0] is None:
        result=[]
    else:   
        result=result[0].split(',')
    if (str(id)) in result:
        result.remove(str(id))
    if len(result)>19:
        result.pop(0)
    result.append(str(id))

    string=(",".join(result))
    if emailExists:
        update_query = """
        UPDATE users SET movie_id = %s WHERE email_hash = %s;
        """
    else:
        update_query = """
        UPDATE users SET movie_id = %s WHERE username_hash = %s;
        """
    
    cursor.execute(update_query, [string, account])
    select_query = """
    SELECT * FROM movies where movieID=%s;
    """
    cursor.execute(select_query, [str(id)])
    
    r=cursor.fetchall()
    if len(r)==0:
        insert_query="""
        insert into movies (movieID,director,title,releaseYear,rating,tagline,movie_description,poster_url,trailer,wheretowatch)
        values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
        """
        cursor.execute(insert_query,[str(id),str(director),str(title),str(year),str(rating),str(tagline),str(description),str(posterImg),str(href),str(link)])
    connection.commit()
    
    result=result[::-1]
    for i in range(len(result)):
        mvID=int(result[i])

        select_query = """
        SELECT poster_url,title FROM movies WHERE movieID=%s;
        """
        cursor.execute(select_query, [str(mvID)])
        tup=cursor.fetchall()
        

        picture,titleMovie = tup[0]
        if picture==None:
            picture=""
        if titleMovie==None:
            titleMovie=""

        result[i]=[picture,titleMovie,str(mvID)]

        
    cursor.close()
    connection.close()
    return data,result
    

def get_random_movie(userLetterboxd):
    # URL of the page you want to scrape
    #url = 'https://letterboxd.com/Arsh_Sandhu/watchlist/'
    #url = 'https://letterboxd.com/davyiu/watchlist/'
    lists=[]
    # Send a GET request to the URL

    def grabPage(url,pageNum=1):
        

        newurl=url+f'{pageNum}/'
        response = requests.get(newurl)

        soup = BeautifulSoup(response.content, 'html.parser')
            
        ul_element = soup.find('ul', class_='poster-list -p125 -grid -scaled128')
        
        if ul_element:
            new_elements = soup.find_all('li',class_ = 'poster-container')
                
            if new_elements:

                for element in new_elements:
                    tag = element.find('div')
                        
                    film_slug = tag.get('data-film-slug')
                    if film_slug:

                        lists.append(film_slug)

    genre_choices = {'1':'action','2':'adventure','3':'animation','4':'comedy','5':'crime','6':'documentary','7':'drama','8':'family','9':'fantasy','10':'history','11':'horror','12':'music','13':'mystery','14':'romance','15':'science-fiction','16':'thriller','17':'tv-movie','18':'war','19':'western'} 
    # choice = input("Do you want a genre, Yes-Y    No-N\n")
    get_genre=0
    choice = 'N'
    if choice[0].capitalize() == 'Y':
        get_genre = input("1:'Action'\t2:'Adventure'\t3:'Animation'\n4:'Comedy'\t5:'Crime'\t6:'Documentary'\n7:'Drama'\t8:'Family'\t9:'Fantasy'\n10:'History'\t11:'Horror'\t12:'Music'\n13:'Mystery'\t14:'Romance'\t15:'Science Fiction'\n16:'Thriller'\t17:'Tv Movie'\t18:'War'\n19:'Western'\n")

    url = 'https://letterboxd.com/'
    url+=userLetterboxd
    url+='/watchlist/'

    if get_genre in genre_choices:
        url+='genre/'+genre_choices[get_genre]+'/'

    response = requests.get(url)
    if(response.status_code != 200):
        return "This user does not exist"
    soup = BeautifulSoup(response.content, 'html.parser')
    page = soup.find_all('li',class_='paginate-page')
        
    if len(page)!=0:
        page_number = int(page[-1].a.text.strip())
    else:
        page_number=1

    url+='page/'
    grabPage(url,random.randint(1,page_number))
    # Create and start threads
    


    # Wait for all threads to completeprint
    
    if len(lists)==0:
        return "User has nothing in wishlist"
    return (random.choice(lists))

if __name__ == "__main__":
    app.run(debug=False)


#create a linked list


