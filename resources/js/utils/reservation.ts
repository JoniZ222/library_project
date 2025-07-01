import axios from "axios";

export const createReservation = async (bookId: string, userId: string, reason: string, plannedReturnDate: string) => {
    const response = await axios.post(route('reservations.store'), {
        book_id: bookId,
        user_id: userId,
        reason,
        planned_return_date: plannedReturnDate,
    });
    return response.data;
};
