<div class="tweet-list">

  <% for (var i = 0; i < locals.length; i++ ) { %>
    <% var tweet=locals.models[i].attributes; %>
    <div class="tweet-container">
      <div class="tweet">
        <div class="tweet-info">
          <img class="tweet-user-avatar" src="<%=tweet.user.profile_image_url %>">
          <div class="tweet-info-text">
            <strong class="tweet-user-fullname"><%=tweet.user.name %></strong>
            <a href="[USER_URL]">
              <span class="tweet-user-username">@<b><%=tweet.user.username %></b></span>
            </a>
            <span class="tweet-timestamp">- <%=locals.moment(new Date(tweet.createdAt)).fromNow() %></span>
          </div>
        </div>
        <div class="tweet-content"><%=tweet.text %></div>
        <div class="tweet-actions">
          <div class="replies">
            <i class="far fa-comment"></i>
            <%=tweet.reply_count %>
          </div>
          <div class="retweets">
            <i class="fas fa-retweet"></i>
            <%=tweet.retweet_count %>
          </div>
          <div class="favs">
            <i class="far fa-heart"></i>
            <%=tweet.favorite_count %>
          </div>
        </div>
      </div>
    </div>
  <% } %>

</div>
