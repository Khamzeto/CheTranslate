'use client';

import React, { useEffect, useState } from 'react';
import {
  IconCheck,
  IconCopy,
  IconPlayerPlay,
  IconSearch,
  IconTrash,
  IconZoomIn,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import CustomHeader from '@/components/CustomHeader/CustomHeader';

const SavedTranslations = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [savedTranslations, setSavedTranslations] = useState([]);
  console.log(savedTranslations);
  const [filteredTranslations, setFilteredTranslations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const storedTranslations = localStorage.getItem('savedWords');
    const parsedTranslations = storedTranslations ? JSON.parse(storedTranslations) : [];
    setSavedTranslations(parsedTranslations);
    setFilteredTranslations(parsedTranslations);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = term
      ? savedTranslations.filter((translation) =>
          translation.word.toLowerCase().includes(term.toLowerCase())
        )
      : savedTranslations;
    setFilteredTranslations(results);
  };

  const handleDelete = (index) => {
    const updatedTranslations = savedTranslations.filter((_, i) => i !== index);
    setSavedTranslations(updatedTranslations);
    setFilteredTranslations(updatedTranslations);
    localStorage.setItem('savedWords', JSON.stringify(updatedTranslations));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openModal = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const startStudyMode = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const normalizeText = (text) => {
    return text
      .replace(/<[^>]*>/g, '') // Убираем HTML-теги
      .replace(/[^\w\sа-яА-ЯёЁ]/g, '') // Убираем всё, кроме букв, цифр и пробелов
      .replace(/\s+/g, ' ') // Убираем лишние пробелы
      .trim()
      .toLowerCase();
  };

  const checkAnswer = () => {
    const correctAnswer = Array.isArray(filteredTranslations[currentCardIndex].translation)
      ? filteredTranslations[currentCardIndex].translation.map((t) => t.translation).join(' ')
      : filteredTranslations[currentCardIndex].translation;

    const cleanedCorrectAnswer = normalizeText(correctAnswer);
    const cleanedUserInput = normalizeText(userInput);

    // Проверяем, что пользовательский ответ содержится в правильном ответе, или совпадают полностью
    setIsCorrect(
      cleanedCorrectAnswer.includes(cleanedUserInput) || cleanedUserInput === cleanedCorrectAnswer
    );
    setShowAnswer(true);
  };

  const showNextCard = () => {
    if (currentCardIndex < filteredTranslations.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setUserInput('');
      setShowAnswer(false);
      setIsCorrect(null);
    } else {
      setStudyMode(false);
    }
  };

  return (
    <>
      <CustomHeader />
      <Container size="sm" style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Paper
          radius="lg"
          p="lg"
          style={{
            width: '100%',
            maxWidth: 700,
            backgroundColor: isDark ? '#3a3a3c' : '#f7f7f9',
            color: isDark ? '#ecf0f1' : '#34495e',
          }}
        >
          <Title
            order={1}
            align="center"
            style={{
              fontSize: '24px',
              marginBottom: '20px',
              color: isDark ? '#ffffff' : '#2c3e50',
            }}
          >
            Сохранённые переводы
          </Title>

          <TextInput
            placeholder="Поиск по сохранённым переводам"
            icon={<IconSearch size={18} />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            mb="lg"
          />

          <Button
            fullWidth
            variant="outline"
            color="blue"
            leftSection={<IconPlayerPlay size={18} />}
            onClick={startStudyMode}
            mb="lg"
          >
            Начать режим изучения
          </Button>

          {studyMode ? (
            <Paper
              p="md"
              shadow="md"
              radius="md"
              style={{ backgroundColor: isDark ? '#3a3a3c' : '#f1f1f3' }}
            >
              <Text size="lg" weight={500} align="center">
                {filteredTranslations[currentCardIndex].word}
              </Text>
              <TextInput
                placeholder="Ваш перевод"
                value={userInput}
                onChange={(e) => setUserInput(e.currentTarget.value)}
                mt="md"
              />
              <Group position="center" mt="md">
                <Button variant="light" onClick={checkAnswer} disabled={showAnswer}>
                  Проверить ответ
                </Button>
                {showAnswer && (
                  <Text color={isCorrect ? 'green' : 'red'} weight={600}>
                    {isCorrect ? 'Верно!' : 'Неверно!'}
                  </Text>
                )}
                <Button variant="outline" onClick={showNextCard}>
                  {currentCardIndex < filteredTranslations.length - 1 ? 'Следующая' : 'Закончить'}
                </Button>
              </Group>
              {showAnswer && (
                <Text
                  size="sm"
                  mt="md"
                  style={{
                    whiteSpace: 'pre-wrap',
                    color: isDark ? '#dfe6e9' : '#2c3e50',
                  }}
                >
                  Правильный перевод:{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: filteredTranslations[currentCardIndex].translation,
                    }}
                  />
                </Text>
              )}
            </Paper>
          ) : (
            filteredTranslations.map((saved, index) => (
              <Paper
                key={index}
                p="md"
                mb="md"
                shadow="sm"
                radius="md"
                style={{ borderBottom: '1px solid #e0e0e0' }}
              >
                <Group position="apart">
                  <Text weight={600} size="lg">
                    {saved.word}
                  </Text>
                  <Group spacing="xs">
                    <Tooltip label="Открыть для изучения">
                      <ActionIcon onClick={() => openModal(saved)} variant="outline" color="blue">
                        <IconZoomIn size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Копировать перевод">
                      <ActionIcon
                        onClick={() => handleCopy(saved.translation)}
                        variant="outline"
                        color="teal"
                      >
                        <IconCopy size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Удалить перевод">
                      <ActionIcon onClick={() => handleDelete(index)} variant="outline" color="red">
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
                <Text size="sm" color="dimmed" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                  Перевод:{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof saved.translation === 'object'
                          ? JSON.stringify(saved.translation, null, 2)
                          : saved.translation,
                    }}
                  />
                </Text>
              </Paper>
            ))
          )}

          {/* Модальное окно для подробного просмотра перевода */}
          <Modal
            opened={showModal}
            onClose={() => setShowModal(false)}
            title="Детали перевода"
            centered
          >
            {modalData && (
              <Group direction="column" spacing="sm">
                <Text size="lg" weight={500}>
                  Слово: {modalData.word}
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  Перевод:
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof modalData.translation === 'object'
                          ? JSON.stringify(modalData.translation, null, 2)
                          : modalData.translation,
                    }}
                  />
                </Text>
              </Group>
            )}
          </Modal>
        </Paper>
      </Container>
    </>
  );
};

export default SavedTranslations;
