import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718203050236 implements MigrationInterface {
    name = 'Migration1718203050236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_1ded90a4a017f8818f19276d67d\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_48562e9a8de6e19439e59e94ed9\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_c48a607c0ab956dfb53e30eef42\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP COLUMN \`comment\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD \`comment\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` CHANGE \`postId\` \`postId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_c48a607c0ab956dfb53e30eef42\` FOREIGN KEY (\`userId\`) REFERENCES \`TB_USER\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_1ded90a4a017f8818f19276d67d\` FOREIGN KEY (\`postId\`) REFERENCES \`TB_POST\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_48562e9a8de6e19439e59e94ed9\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`TB_COMMENT\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TB_POST\` DROP FOREIGN KEY \`FK_69804818428bb1a51e53fd0cea5\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_48562e9a8de6e19439e59e94ed9\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_1ded90a4a017f8818f19276d67d\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP FOREIGN KEY \`FK_c48a607c0ab956dfb53e30eef42\``);
        await queryRunner.query(`ALTER TABLE \`TB_IMAGE_URL\` DROP FOREIGN KEY \`FK_277a47c70f119fea2aea12252fd\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_USER\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` DROP COLUMN \`category\``);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` ADD \`category\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` ADD \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` CHANGE \`postId\` \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` DROP COLUMN \`comment\``);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD \`comment\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_IMAGE_URL\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`TB_IMAGE_URL\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TB_POST\` ADD CONSTRAINT \`FK_69804818428bb1a51e53fd0cea5\` FOREIGN KEY (\`userId\`) REFERENCES \`v8cdb\`.\`TB_USER\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_c48a607c0ab956dfb53e30eef42\` FOREIGN KEY (\`userId\`) REFERENCES \`v8cdb\`.\`TB_USER\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_48562e9a8de6e19439e59e94ed9\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`v8cdb\`.\`TB_COMMENT\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_COMMENT\` ADD CONSTRAINT \`FK_1ded90a4a017f8818f19276d67d\` FOREIGN KEY (\`postId\`) REFERENCES \`v8cdb\`.\`TB_POST\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TB_IMAGE_URL\` ADD CONSTRAINT \`FK_277a47c70f119fea2aea12252fd\` FOREIGN KEY (\`postId\`) REFERENCES \`v8cdb\`.\`TB_POST\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
