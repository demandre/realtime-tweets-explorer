<ul class="tasks">
  <% for(var i = 0, len = locals.length; i < len; i += 1) { %>
    <li><%- locals[i].name %></li>
  <% } %>
</ul>