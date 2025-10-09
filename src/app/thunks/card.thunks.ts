import { nanoid } from "nanoid";
import type { AppDispatch } from "../store/store";
import type { CardData } from "../../utils/interface/card";
import { getNextCloneTitle } from "../../utils/get-clone-Title";
import { CARD_KEY } from "../../utils/constants/card";
import { toast } from "react-toastify";
import { setCardsForColumn } from "../slices/card.slice";

const getAllCards = (): CardData[] => {
  const rawCards = localStorage.getItem(CARD_KEY);
  return rawCards ? (JSON.parse(rawCards) as CardData[]) : [];
};

const saveAllCards = (cards: CardData[]): void => {
  localStorage.setItem(CARD_KEY, JSON.stringify(cards));
};

const getCardsByColumn = (cards: CardData[], columnId: string) =>
  cards.filter((card) => card.columnId === columnId);

export const loadCardsForColumn =
  (columnId: string) =>
  (dispatch: AppDispatch): void => {
    const allCards = getAllCards();
    const columnCards = getCardsByColumn(allCards, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };

export const addCardToColumn =
  (boardId: string, columnId: string, rawTitle: string) =>
  (dispatch: AppDispatch): void => {
    const title = rawTitle.trim();
    const newCard: CardData = {
      id: nanoid(),
      title,
      boardId,
      columnId,
    };

    const allCards = getAllCards();
    const updatedAllCards = [newCard, ...allCards];
    saveAllCards(updatedAllCards);

    const columnCards = getCardsByColumn(updatedAllCards, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };

export const updateCardInColumn =
  (incomingCard: CardData) =>
  (dispatch: AppDispatch): void => {
    const allCards = getAllCards();

    const normalizedTitle = incomingCard.title.trim();
    if (!normalizedTitle) {
      toast.error("Title cannot be empty.");
      return;
    }

    const cardsInSameColumn = allCards.filter(
      (card) => card.columnId === incomingCard.columnId
    );

    const isDuplicateTitle = cardsInSameColumn.some(
      (existingCard) =>
        existingCard.id !== incomingCard.id &&
        existingCard.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
    );
    if (isDuplicateTitle) {
      toast.error("A card with this title already exists in this column.");
      return;
    }

    const updatedCard: CardData = { ...incomingCard, title: normalizedTitle };
    const updatedAllCards = allCards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    saveAllCards(updatedAllCards);

    const columnCards = getCardsByColumn(updatedAllCards, updatedCard.columnId);
    dispatch(
      setCardsForColumn({ columnId: updatedCard.columnId, cards: columnCards })
    );
    toast.success("Card updated.");
  };

export const deleteCardFromColumn =
  (columnId: string, cardId: string) =>
  (dispatch: AppDispatch): void => {
    const remainingCards = getAllCards().filter((card) => card.id !== cardId);
    saveAllCards(remainingCards);

    const columnCards = getCardsByColumn(remainingCards, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };

export const cloneCardInColumn =
  (columnId: string, sourceCardId: string) =>
  (dispatch: AppDispatch): void => {
    const allCards = getAllCards();

    const sourceIndex = allCards.findIndex(
      (card) => card.id === sourceCardId && card.columnId === columnId
    );
    if (sourceIndex === -1) return;

    const sourceCard = allCards[sourceIndex];

    const existingTitlesInColumn = getCardsByColumn(allCards, columnId).map(
      (card) => card.title
    );
    const clonedTitle = getNextCloneTitle(sourceCard.title, existingTitlesInColumn);

    const clonedCard: CardData = {
      ...sourceCard,
      id: nanoid(),
      title: clonedTitle,
    };

    const updatedAllCards = [
      ...allCards.slice(0, sourceIndex + 1),
      clonedCard,
      ...allCards.slice(sourceIndex + 1),
    ];

    saveAllCards(updatedAllCards);

    const columnCards = getCardsByColumn(updatedAllCards, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };
