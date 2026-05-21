--
-- PostgreSQL database dump
--

\restrict fSn1OCQ7aOBMtdfrNgTs9ZlMQBwXzVU7m9VMOH3GTXe1XhKbyiOzta0gMUcBYW4

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."Category" (
    category_id uuid NOT NULL,
    user_id uuid NOT NULL,
    category_name text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO ntbinh;

--
-- Name: LearningLog; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."LearningLog" (
    log_id uuid NOT NULL,
    user_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    study_date timestamp(3) without time zone NOT NULL,
    duration_minutes integer NOT NULL,
    study_content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LearningLog" OWNER TO ntbinh;

--
-- Name: StudySession; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."StudySession" (
    session_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    start_time timestamp(3) without time zone,
    end_time timestamp(3) without time zone,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    planned_minutes integer NOT NULL,
    actual_minutes integer
);


ALTER TABLE public."StudySession" OWNER TO ntbinh;

--
-- Name: Target; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."Target" (
    target_id uuid NOT NULL,
    user_id uuid NOT NULL,
    target_hours integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Target" OWNER TO ntbinh;

--
-- Name: Topic; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."Topic" (
    topic_id uuid NOT NULL,
    user_id uuid NOT NULL,
    category_id uuid NOT NULL,
    topic_name text NOT NULL,
    description text,
    start_date timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    estimated_hours integer
);


ALTER TABLE public."Topic" OWNER TO ntbinh;

--
-- Name: User; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public."User" (
    user_id uuid NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    profile_picture text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO ntbinh;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ntbinh
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ntbinh;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."Category" (category_id, user_id, category_name, description, created_at, updated_at) FROM stdin;
648c8f23-eb38-42ea-b44f-995ad0c642a4	550e8400-e29b-41d4-a716-446655440000	Programming	Coding skills	2026-04-16 05:45:46.374	2026-04-16 05:45:46.374
bb383908-9517-4e48-8074-f6985947475c	550e8400-e29b-41d4-a716-446655440000	Business Analysis	\N	2026-04-17 07:40:58.623	2026-04-17 07:40:58.623
61500d73-79ef-4ba5-ad9d-6fd5ba3a14c7	550e8400-e29b-41d4-a716-446655440000	Marketing	\N	2026-04-17 09:10:57.52	2026-04-17 09:10:57.52
\.


--
-- Data for Name: LearningLog; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."LearningLog" (log_id, user_id, topic_id, study_date, duration_minutes, study_content, created_at, updated_at) FROM stdin;
e62dbbf8-560d-49e9-af4a-0c6e6dfe5b2b	550e8400-e29b-41d4-a716-446655440000	c84159fb-621b-4ef7-b67f-31718de9af13	2026-04-17 00:00:00	60	Learned SELECT statement	2026-04-17 10:51:59.668	2026-04-17 10:51:59.668
\.


--
-- Data for Name: StudySession; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."StudySession" (session_id, topic_id, start_time, end_time, notes, created_at, updated_at, planned_minutes, actual_minutes) FROM stdin;
1e3181e7-0f59-4a52-88e4-c0124ccf66bb	8380f65b-f744-49b3-af5b-3d82d10566f2	2026-04-16 06:32:24.513	2026-04-16 06:35:18.353	\N	2026-04-16 06:32:24.514	2026-04-16 06:35:18.354	3	3
0c44aa43-6860-41a3-929a-d911248c39ed	52575e45-9314-45f8-9451-2127244a7aa5	2026-04-17 07:50:20.761	2026-04-17 07:52:58.546	\N	2026-04-17 07:50:20.762	2026-04-17 07:52:58.548	3	3
703aadd7-8b8f-42c0-9f8f-f5bcf7de98b0	52575e45-9314-45f8-9451-2127244a7aa5	2026-04-17 09:19:29.932	2026-04-17 09:48:38.071	Học BMC module 1	2026-04-17 09:19:29.934	2026-04-17 09:48:38.071	0	29
29f93e09-cf25-41d1-910b-66e13217384a	8380f65b-f744-49b3-af5b-3d82d10566f2	2026-04-17 09:20:36.043	2026-04-17 09:48:39.62	Học JS Basic 1	2026-04-17 09:20:36.044	2026-04-17 09:48:39.621	0	28
adc74c57-53f3-4ae9-80c1-25db289f5e65	c84159fb-621b-4ef7-b67f-31718de9af13	2026-04-17 09:56:58.165	\N	Học chạy ads facebook	2026-04-17 09:56:53.045	2026-04-17 09:56:58.167	20	\N
\.


--
-- Data for Name: Target; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."Target" (target_id, user_id, target_hours, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."Topic" (topic_id, user_id, category_id, topic_name, description, start_date, status, created_at, updated_at, estimated_hours) FROM stdin;
8380f65b-f744-49b3-af5b-3d82d10566f2	550e8400-e29b-41d4-a716-446655440000	648c8f23-eb38-42ea-b44f-995ad0c642a4	JavaScript Basics	Learn JS fundamentals	2026-04-16 06:11:29.699	Not Started	2026-04-16 06:11:29.712	2026-04-16 06:11:29.712	10
52575e45-9314-45f8-9451-2127244a7aa5	550e8400-e29b-41d4-a716-446655440000	bb383908-9517-4e48-8074-f6985947475c	Business Model Canvas	\N	2026-04-17 07:43:03.729	Not Started	2026-04-17 07:43:03.73	2026-04-17 07:43:03.73	\N
c84159fb-621b-4ef7-b67f-31718de9af13	550e8400-e29b-41d4-a716-446655440000	61500d73-79ef-4ba5-ad9d-6fd5ba3a14c7	Marketing Digital	\N	2026-04-17 09:55:36.463	Not Started	2026-04-17 09:55:36.464	2026-04-17 09:55:36.464	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public."User" (user_id, email, name, profile_picture, created_at, updated_at) FROM stdin;
550e8400-e29b-41d4-a716-446655440000	test@example.com	Test User	\N	2026-04-16 12:31:51.825	2026-04-16 12:31:51.825
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ntbinh
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
40be95d7-7272-42d7-ba43-03290f0a88a1	cec1bbc6acd9c334be4085d00d39b0bd8baeaf2ce33cfaa81e6400a500eebf59	2026-04-15 11:31:40.326584+07	20260415043140_init	\N	\N	2026-04-15 11:31:40.316782+07	1
9b021847-b939-4798-82f5-866c101663fa	653e1980c08cef4245e0bccb53af5db3a869c370884c65cd7239ce1c2cd76033	2026-04-16 13:11:02.202185+07	20260416061102_add_estimated_hours_to_topic	\N	\N	2026-04-16 13:11:02.200804+07	1
617c57df-df46-47bb-b710-138d8042ea49	0d538e775bb5e5312c175d43a56a6709b90000d44a89c5b5168cfc42ace9d620	2026-04-16 13:22:16.8105+07	20260416062216_add_study_sessions	\N	\N	2026-04-16 13:22:16.802554+07	1
aa429a79-9590-4673-b3e2-0dd73eb90067	52dbe1329b0b2df4ab015e73cccfcf8b299817f2bb6093e33a5511932ff859a3	2026-04-17 16:40:01.42935+07	20260417092000_add_planned_actual_minutes	\N	\N	2026-04-17 16:40:01.419912+07	1
3afb3283-dc6b-449e-a004-00439326f079	51a44408c1f12ead576693afadd35038e67b0dd597e06a317453da1f27e60d86	2026-04-17 17:51:24.605321+07	20260417105124_fix_learning_log_structure	\N	\N	2026-04-17 17:51:24.602157+07	1
\.


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (category_id);


--
-- Name: LearningLog LearningLog_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."LearningLog"
    ADD CONSTRAINT "LearningLog_pkey" PRIMARY KEY (log_id);


--
-- Name: StudySession StudySession_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."StudySession"
    ADD CONSTRAINT "StudySession_pkey" PRIMARY KEY (session_id);


--
-- Name: Target Target_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Target"
    ADD CONSTRAINT "Target_pkey" PRIMARY KEY (target_id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (topic_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Category_user_id_idx; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE INDEX "Category_user_id_idx" ON public."Category" USING btree (user_id);


--
-- Name: StudySession_topic_id_idx; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE INDEX "StudySession_topic_id_idx" ON public."StudySession" USING btree (topic_id);


--
-- Name: Target_user_id_key; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE UNIQUE INDEX "Target_user_id_key" ON public."Target" USING btree (user_id);


--
-- Name: Topic_category_id_idx; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE INDEX "Topic_category_id_idx" ON public."Topic" USING btree (category_id);


--
-- Name: Topic_user_id_idx; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE INDEX "Topic_user_id_idx" ON public."Topic" USING btree (user_id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: ntbinh
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Category Category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LearningLog LearningLog_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."LearningLog"
    ADD CONSTRAINT "LearningLog_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(topic_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudySession StudySession_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."StudySession"
    ADD CONSTRAINT "StudySession_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(topic_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Target Target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Target"
    ADD CONSTRAINT "Target_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Topic Topic_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(category_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Topic Topic_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ntbinh
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict fSn1OCQ7aOBMtdfrNgTs9ZlMQBwXzVU7m9VMOH3GTXe1XhKbyiOzta0gMUcBYW4

