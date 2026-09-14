
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";
import { useGetKitsQuery,useDeleteKitMutation } from "../services/kitApi";

const NAV_ITEMS = [
    { label: "Overview", key: "overview" },
    { label: "Kits", key: "kits" },
    { label: "Question bank", key: "questions" },
    { label: "Settings", key: "settings" },
];

const Dashboard = () =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { data,isLoading,isError } = useGetKitsQuery();
    const [deleteKit] = useDeleteKitMutation();

    const kits = Array.isArray(data) ? data : data?.kits || [];
    const initial = (user?.name || user?.email || "C").charAt(0).toUpperCase();

    const handleLogout = () =>
    {
        dispatch(logout());
        navigate("/login");
    };

    const handleDeleteKit = async (kitId) =>
    {
        const confirmed = window.confirm("Are you sure you want to delete this preparation kit?");

        if (!confirmed)
        {
            return;
        }

        try
        {
            await deleteKit(kitId).unwrap();
        }
        catch (error)
        {
            console.error("Delete Kit error:",error);
            alert("Unable to delete the preparation kit.");
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 lg:flex">

            {/* SIDEBAR */}
            <aside className="flex flex-col justify-between bg-stone-950 px-6 py-8 lg:w-64 lg:flex-shrink-0 lg:px-7 lg:py-10">

                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-serif text-sm font-bold italic text-stone-950">
                            ai
                        </span>

                        <span className="font-mono text-[11px] leading-tight tracking-wide text-stone-400">
                            INTERVIEW<br />PREP KIT
                        </span>
                    </div>

                    <nav className="mt-10 hidden flex-col gap-1 lg:flex">
                        {NAV_ITEMS.map((item,i) => (
                            <button
                                key={item.key}
                                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                                    i === 0
                                        ? "bg-stone-900 text-amber-400"
                                        : "text-stone-400 hover:bg-stone-900/60 hover:text-stone-200"
                                }`}
                            >
                                <span className="font-mono text-[10px] text-stone-600">
                                    0{i + 1}
                                </span>

                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="hidden items-center justify-between border-t border-stone-800 pt-5 lg:flex">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-200">
                            {initial}
                        </span>

                        <span className="truncate text-xs text-stone-400">
                            {user?.name || user?.email || "Candidate"}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex-shrink-0 text-xs text-stone-500 transition-colors hover:text-amber-400"
                    >
                        Exit
                    </button>
                </div>

                {/* Mobile top bar content collapses into this row */}
                <div className="flex items-center justify-between lg:hidden">
                    <span className="text-xs text-stone-500">
                        {user?.name || user?.email || "Candidate"}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="text-xs text-stone-500 hover:text-amber-400"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 px-6 py-10 sm:px-10 lg:px-14 lg:py-14">

                {/* Hero row */}
                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-xl">
                        <p className="font-mono text-xs uppercase tracking-widest text-stone-500">
                            {new Date().toLocaleDateString
                            (
                                undefined,
                                {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric"
                                }
                            )}
                        </p>

                        <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-stone-900 sm:text-5xl">
                            Ready when<br className="hidden sm:block" /> you are{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/create-kit")}
                        className="group flex w-fit items-center gap-3 self-start rounded-full bg-stone-950 py-3 pl-5 pr-2 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800"
                    >
                        New preparation kit

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-stone-950 transition-transform group-hover:rotate-45">
                            +
                        </span>
                    </button>
                </div>

                {/* Bento stats */}
                <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">

                    <div className="col-span-2 rounded-2xl bg-stone-950 p-6 text-stone-50 sm:col-span-1">
                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                            Total kits
                        </p>

                        <p className="mt-3 font-serif text-4xl">
                            {isLoading ? "–" : kits.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-6">
                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            Status
                        </p>

                        <p className="mt-3 flex items-center gap-1.5 font-serif text-2xl text-stone-900">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-6">
                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            Questions
                        </p>

                        <p className="mt-3 font-serif text-2xl text-stone-900">
                            {kits.reduce
                            (
                                (sum,k) =>
                                sum + (k.kit?.questions?.length || 0),
                                0
                            )}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-6">
                        <p className="font-mono text-[11px] uppercase tracking-wide text-stone-400">
                            Account
                        </p>

                        <p className="mt-3 truncate font-serif text-lg text-stone-900">
                            {user?.email || "Candidate"}
                        </p>
                    </div>
                </div>

                {/* Kit list */}
                <div className="mt-12">

                    <div className="mb-5 flex items-end justify-between">
                        <h2 className="font-serif text-2xl text-stone-900">
                            Preparation kits
                        </h2>

                        {!isLoading && !isError && kits.length > 0 && (
                            <span className="font-mono text-xs text-stone-400">
                                {String(kits.length).padStart(2,"0")} total
                            </span>
                        )}
                    </div>

                    {isLoading && (
                        <div className="space-y-3">
                            {[0,1,2].map((i) => (
                                <div
                                    key={i}
                                    className="h-20 animate-pulse rounded-2xl border border-stone-200 bg-white"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                            <p className="text-sm text-red-700">
                                Unable to load your preparation kits.
                            </p>

                            <p className="mt-1 text-xs text-red-500">
                                Check your connection and try refreshing the page.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && kits.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                            <p className="font-serif text-xl text-stone-800">
                                No preparation kits yet.
                            </p>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                                Start with a job description and company website. We'll turn them
                                into questions, flashcards and a preparation schedule.
                            </p>

                            <button
                                onClick={() => navigate("/create-kit")}
                                className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800"
                            >
                                Create your first kit
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && kits.length > 0 && (
                        <div className="space-y-3">

                            {kits.map((kit,i) => (
                                <div
                                    key={kit._id}
                                    className="group flex w-full items-center gap-5 rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-stone-900 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] sm:p-6"
                                >

                                    <span className="hidden font-mono text-xs text-stone-300 sm:block">
                                        {String(i + 1).padStart(2,"0")}
                                    </span>

                                    <button
                                        onClick={() => navigate(`/kit/${kit._id}`)}
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber-700">
                                                {kit.status || "draft"}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 truncate text-lg font-medium text-stone-900">
                                            {kit.kit?.role?.title || "Untitled role"}
                                        </h3>

                                        <p className="truncate text-sm text-stone-500">
                                            {kit.kit?.source?.company || "Company not available"}
                                        </p>
                                    </button>

                                    <div className="hidden flex-col items-end gap-1 text-right sm:flex">
                                        <span className="text-xs text-stone-400">
                                            {kit.kit?.role?.requirements?.length || 0} requirements
                                        </span>

                                        <span className="text-xs text-stone-400">
                                            {kit.kit?.questions?.length || 0} questions
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteKit(kit._id)}
                                        className="flex-shrink-0 rounded-full px-3 py-2 text-xs text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => navigate(`/kit/${kit._id}`)}
                                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-950 hover:text-amber-400"
                                    >
                                        →
                                    </button>

                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

