// OAuth2 route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  });
