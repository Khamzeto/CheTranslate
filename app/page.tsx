// Translator.js
'use client';

import React, { useEffect, useState } from 'react';
import { IconLanguage, IconMicrophone, IconX } from '@tabler/icons-react';
import axios from 'axios';
import {
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Space,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import CustomHeader from '@/components/CustomHeader/CustomHeader';
import TranslatorResults from '@/components/TranslatorResults/TranslatorResults';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false); // Для отслеживания статуса микрофона
  const [lang, setLang] = useState('ce'); // 'ce' - чеченский, 'ru' - русский
  const [translationHistory, setTranslationHistory] = useState([]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  // Загружаем историю переводов из localStorage при монтировании
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('translationHistory')) || [];
    setTranslationHistory(storedHistory);
  }, []);

  // Сохраняем историю переводов в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
  }, [translationHistory]);

  const handleTranslate = async () => {
    setLoading(true);
    setTranslatedText('');

    const formData = new FormData();
    formData.append('word', inputText);
    formData.append('lang', lang);

    try {
      const response = await axios.post('https://ps95.ru/dikdosham/dosh.php', formData);
      setTranslatedText(response.data);
      setTranslationHistory([
        { input: inputText, output: response.data, lang },
        ...translationHistory,
      ]);
    } catch (error) {
      setTranslatedText('Ошибка при переводе');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'ce' ? 'ru-RU' : 'ru-RU';
      recognition.continuous = false;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setInputText((prev) => `${prev} ${speechToText}`);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } else {
      console.error('Распознавание речи не поддерживается в этом браузере.');
    }
  };

  const clearInput = () => setInputText('');
  const switchLang = () => setLang((prev) => (prev === 'ce' ? 'ru' : 'ce'));

  return (
    <>
      <CustomHeader />

      <Container size="sm" style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Paper radius="lg" p="lg" style={{ width: '100%', maxWidth: 600 }}>
          <Title
            order={1}
            align="center"
            style={{
              fontSize: '28px',
              marginBottom: '10px',
            }}
          >
            Чеченско-Русский Переводчик
          </Title>
          <Text align="center" color="dimmed" style={{ marginBottom: '20px', fontSize: '14px' }}>
            Быстрый и точный перевод с чеченского на русский и наоборот
          </Text>

          <Group position="center" mb="md" style={{ justifyContent: 'space-between' }}>
            <Button
              onClick={switchLang}
              variant="subtle"
              color="blue"
              leftSection={<IconLanguage size={18} />}
            >
              {lang === 'ce' ? 'Чеченский -> Русский' : 'Русский -> Чеченский'}
            </Button>
            <Button
              onClick={clearInput}
              color="gray"
              variant="subtle"
              leftSection={<IconX size={14} />}
            >
              Очистить
            </Button>
          </Group>

          {/* Контейнер для Textarea с иконкой микрофона */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Textarea
              placeholder="Введите текст для перевода"
              value={inputText}
              onChange={(e) => setInputText(e.currentTarget.value)}
              minRows={4}
              mb="md"
              w="100%"
              autosize
            />
            <div
              onClick={startListening}
              color={listening ? 'red' : 'blue'}
              variant="light"
              title="Голосовой ввод"
              style={{
                position: 'absolute',
                left: '10px',
                bottom: '8px',

                cursor: 'pointer',
              }}
            >
              <IconMicrophone color={listening ? 'red' : '#228be6'} size={18} />
            </div>
          </div>

          <Button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            fullWidth
            radius="md"
            size="lg"
          >
            {loading ? <Loader size="xs" color="white" /> : 'Перевести'}
          </Button>

          <Space h="md" />
          {translatedText ? (
            <TranslatorResults data={translatedText} />
          ) : (
            <Text align="center" color="dimmed" mt="lg">
              Введите текст и нажмите "Перевести" для начала
            </Text>
          )}

          {loading && (
            <Text color="dimmed" align="center" mt="md" size="sm">
              Выполняется перевод, пожалуйста, подождите...
            </Text>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Translator;
