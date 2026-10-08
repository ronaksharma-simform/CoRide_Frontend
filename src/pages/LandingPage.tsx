const LandingPage = () => {
  return (
    <div className="flex justify-evenly ">
      Landing Page
      <div className="flex gap-4 ">
        <a className="text-blue-600 underline" href="/login">
          Login
        </a>
        <a className="text-blue-600 underline" href="/signup">
          SignUp
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
