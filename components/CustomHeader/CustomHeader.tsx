// components/CustomHeader.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBookmark,
  IconHistory,
  IconHome,
  IconInfoCircle,
  IconMoonStars,
  IconSun,
} from '@tabler/icons-react';
import { ActionIcon, Group, Modal, Text, Title, useMantineColorScheme } from '@mantine/core';

import './CustomHeader.css';

const CustomHeader = () => {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <>
      <header
        className="header"
        style={{
          height: '60px',
          padding: '0 20px',
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Group
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Title
            onClick={() => handleNavigate('/')}
            order={3}
            style={{
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1.5rem',
              flex: '1 1 auto',
            }}
          >
            CheTranslate
          </Title>
          <Group
            spacing="xs"
            style={{
              flex: '1 1 auto',
              justifyContent: 'flex-end',
            }}
          >
            <ActionIcon
              onClick={() => handleNavigate('/')}
              color="white"
              variant="transparent"
              size="lg"
              title="Главная"
            >
              <IconHome size={22} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              onClick={() => handleNavigate('/history')}
              color="white"
              variant="transparent"
              size="lg"
              title="История переводов"
            >
              <IconHistory size={22} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              onClick={() => handleNavigate('/saved')}
              color="white"
              variant="transparent"
              size="lg"
              title="Сохранённые слова"
            >
              <IconBookmark size={22} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              onClick={toggleColorScheme}
              color="white"
              variant="transparent"
              size="lg"
              title={colorScheme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              {colorScheme === 'dark' ? (
                <IconSun size={22} stroke={1.5} />
              ) : (
                <IconMoonStars size={22} stroke={1.5} />
              )}
            </ActionIcon>
            <ActionIcon
              onClick={() => setAboutModalOpen(true)}
              color="white"
              variant="transparent"
              size="lg"
              title="О программе"
            >
              <IconInfoCircle size={22} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </header>

      {/* Модальное окно для информации "О программе" */}
      <Modal
        radius="14"
        opened={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="О программе CheTranslate"
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
        styles={{
          body: {
            padding: '1rem',
            fontSize: '0.9rem',
          },
        }}
      >
        <Text>CheTranslate — приложение для перевода с чеченского на русский и наоборот.</Text>
        <Text mt="md">Возможности:</Text>
        <ul style={{ paddingLeft: '1.2rem', marginTop: '10px' }}>
          <li>Перевод с чеченского на русский и наоборот</li>
          <li>История переводов</li>
          <li>Сохранение переводов</li>
          <li>Темная и светлая темы интерфейса</li>
        </ul>
      </Modal>

      <style jsx>{`
        @media (max-width: 768px) {
          header {
            padding: 0 10px;
          }

          .mantine-Title-root {
            font-size: 1.2rem;
          }

          .mantine-ActionIcon-root {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 0 5px;
          }

          .mantine-Title-root {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default CustomHeader;
