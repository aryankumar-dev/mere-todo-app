const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, username } = useAuthCheck();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGetStarted = () => {
    navigate(isLoggedIn ? '/dashboard' : '/login');
  };

  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">MERN ToDo</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {isLoggedIn && username && (
              <Navbar.Text className="me-3 text-light">
                Welcome, {username}
              </Navbar.Text>
            )}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && isDashboardPage && (
              <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            )}
            {isHomePage && (
              <Button variant="outline-light" onClick={handleGetStarted} className="ms-2">
                Get Started
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
