import { nanoid } from "nanoid";
import type { AppDispatch } from "../store/store";
import type { CardData } from "../../utils/interface/card";
import { getNextCloneTitle } from "../../utils/get-clone-Title";
import { CARD_KEY } from "../../utils/constants/card";
import { toast } from "react-toastify";
import { setCardsForColumn } from "../slices/card.slice";

const getAllCards = (): CardData[] => {
  const raw = localStorage.getItem(CARD_KEY);
  return raw ? (JSON.parse(raw) as CardData[]) : [];
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
    const updatedAll = [newCard, ...allCards];
    saveAllCards(updatedAll);

    const columnCards = getCardsByColumn(updatedAll, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };

export const updateCardInColumn =
  (incoming: CardData) =>
  (dispatch: AppDispatch): void => {
    const allCards = getAllCards();

    const normalizedTitle = incoming.title.trim();
    if (!normalizedTitle) {
      toast.error("Title cannot be empty.");
      return;
    }

    const cardsInSameColumn = allCards.filter(
      (card) => card.columnId === incoming.columnId
    );

    const isDuplicateTitle = cardsInSameColumn.some(
      (existing) =>
        existing.id !== incoming.id &&
        existing.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
    );
    if (isDuplicateTitle) {
      toast.error("A card with this title already exists in this column.");
      return;
    }

    const updatedCard: CardData = { ...incoming, title: normalizedTitle };
    const updatedAll = allCards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    saveAllCards(updatedAll);

    const columnCards = getCardsByColumn(updatedAll, updatedCard.columnId);
    dispatch(
      setCardsForColumn({ columnId: updatedCard.columnId, cards: columnCards })
    );
    toast.success("Card updated.");
  };

export const deleteCardFromColumn =
  (columnId: string, cardId: string) =>
  (dispatch: AppDispatch): void => {
    const remaining = getAllCards().filter((c) => c.id !== cardId);
    saveAllCards(remaining);

    const columnCards = getCardsByColumn(remaining, columnId);
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

    const source = allCards[sourceIndex];

    const existingTitlesInColumn = getCardsByColumn(allCards, columnId).map(
      (card) => card.title
    );
    const clonedTitle = getNextCloneTitle(source.title, existingTitlesInColumn);

    const clonedCard: CardData = {
      ...source,
      id: nanoid(),
      title: clonedTitle,
    };

    const updatedAll = [
      ...allCards.slice(0, sourceIndex + 1),
      clonedCard,
      ...allCards.slice(sourceIndex + 1),
    ];

    saveAllCards(updatedAll);

    const columnCards = getCardsByColumn(updatedAll, columnId);
    dispatch(setCardsForColumn({ columnId, cards: columnCards }));
  };
