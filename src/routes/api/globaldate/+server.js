import supabase from "@lib/db";

export const POST = async ({ request }) => {

    const dateNow = new Date();

    const { teamId } = await request.json();

    const { data, error } = await supabase.from("teams").select(
        "subscription_end_date"
    ).eq("id", teamId);

    let response;
    if (data) {
        const subsDate = new Date(data[0].subscription_end_date);
        const diff = Math.round(
            (Date.parse(dateNow.toUTCString()) - Date.parse(subsDate.toUTCString())) /
            (1000 * 60 * 60 * 24),
        );
        response = {
            subs_end_date: subsDate,
            days_diff: diff,
            isActive: dateNow > subsDate ? false : true,
            isAfter7Days: (diff > 7),
        };
        return new Response(
            JSON.stringify(response),
            {

                status: 200
            },
        );
    } else {
        return new Response(
            JSON.stringify(error),
            {

                status: 400
            },
        );
    }
};

