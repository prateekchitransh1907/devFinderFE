import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { logout } from '../reducers/auth/authSlice'
import { resetPremiumVerify } from "../reducers/payments/paymentSlice";


function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state.auth.user);
    const pendingRequestCount = useSelector(
        (state) => state.requests?.items?.length ?? 0
    );

    const firstName = authUser?.firstName || "";
    const lastName = authUser?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim() || authUser?.emailId || "user";
    const photoUrl = authUser?.photoUrl || null;

    function handleLogout() {
        dispatch(logout());
        dispatch(resetPremiumVerify());
        navigate("/login");
    }

    return (
        <nav className="w-full bg-base-100 shadow-sm px-4 md:px-8 flex items-center justify-between h-16">
            {/* left - logo */}
            <Link to="/" className="flex items-center">
                <Logo size="md" />
            </Link>

            {/* Right - Search + Profile */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search developers..."
                    className="input input-sm input-bordered hidden sm:block w-40 md:w-64"
                />
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        className="btn btn-ghost flex items-center gap-2 px-2"
                    >
                        <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                            Hey, {firstName || "User"}
                        </span>
                        <div className="avatar">
                            <div className="w-9 rounded-full">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={fullName}
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="bg-primary text-primary-content w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">
                                        {firstName.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <Link to="/profile" className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/connections">Connections</Link>
                        </li>
                        <li>
                            <Link to="/requests">
                                Requests
                                {pendingRequestCount > 0 && (
                                    <span className="w-[50x] h-[50x] rounded-full bg-transparent text-white font-bold text-[12px] flex items-center justify-center">
                                        {pendingRequestCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link to="/premium">Premium</Link>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;